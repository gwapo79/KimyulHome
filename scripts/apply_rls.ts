
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Applying RLS Policies & Triggers (Sequential, Qualified) ---");

    const queries = [
        // 0. Set Search Path (Just in case)
        `SET search_path TO public`,

        // 1. Enable RLS on Profile
        `ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY`,

        // CEO Policy
        `CREATE POLICY "CEO view all profiles"
    ON public."Profile"
    FOR SELECT
    USING (
      (SELECT role FROM public."Profile" WHERE email = auth.email()) = 'CEO'
    )`,

        // User Policy
        `CREATE POLICY "Users view own profile"
    ON public."Profile"
    FOR SELECT
    USING (
      auth.uid()::text = supabaseAuthId
    )`,

        // 2. Enable RLS on Case
        `ALTER TABLE public."Case" ENABLE ROW LEVEL SECURITY`,

        // CEO Case Policy
        `CREATE POLICY "CEO full access cases"
    ON public."Case"
    FOR ALL
    USING (
      (SELECT role FROM public."Profile" WHERE email = auth.email()) = 'CEO'
    )`,

        // Staff Case Policy
        `CREATE POLICY "Staff view assigned cases"
    ON public."Case"
    FOR SELECT
    USING (
      assignedStaffId IN (
        SELECT id FROM public."Profile" WHERE email = auth.email()
      )
    )`,

        // Professional Case Policy
        `CREATE POLICY "Professional view assigned cases"
    ON public."Case"
    FOR SELECT
    USING (
      assignedProfessionalId IN (
         SELECT id FROM public."Profile" WHERE email = auth.email()
      )
    )`,

        // 3. User Sync Trigger Function
        `create or replace function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer set search_path = public
    as $$
    begin
      insert into public."Profile" (id, email, role, "supabaseAuthId", name)
      values (new.id, new.email, 'USER', new.id, new.raw_user_meta_data->>'name');
      return new;
    end;
    $$`,

        // 4. Trigger Definition
        `drop trigger if exists on_auth_user_created on auth.users`,
        `create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user()`
    ];

    for (const query of queries) {
        try {
            console.log(`Executing: ${query.substring(0, 50)}...`);
            await prisma.$executeRawUnsafe(query);
        } catch (e: any) {
            if (e.message.includes('already exists')) {
                console.log("  -> Policy/Trigger already exists, skipping/updating.");
            } else {
                console.error("  -> Failed:", e.message);
            }
        }
    }

    console.log("✅ Sequential RLS Application Completed.");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

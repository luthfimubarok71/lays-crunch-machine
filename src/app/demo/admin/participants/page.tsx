import { ParticipantTable } from "@/features/admin/dashboard";
export default function Page() {
  return (
    <>
      <div className="admin-title">
        <div>
          <span className="eyebrow">THE CRUNCH COLLECTIVE</span>
          <h1>Meet the crunchers.</h1>
          <p>
            Identitas contoh dari perjalanan demo. Data hanya tersedia dalam
            sesi browser ini.
          </p>
        </div>
      </div>
      <ParticipantTable />
    </>
  );
}

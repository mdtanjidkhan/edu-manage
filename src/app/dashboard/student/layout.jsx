import { requireRole } from "@/lib/core/session";


const StudentLayout = async ({children}) => {
    await requireRole('student')
    return children;
};

export default StudentLayout;
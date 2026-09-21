import { requireRole } from "@/lib/core/session";


const TeacherLayout = async ({children}) => {
    await requireRole('teacher')
    return children;
};

export default TeacherLayout;
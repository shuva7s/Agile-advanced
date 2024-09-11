import AccessDenied from "@/components/project_page_errors/AccessDenied";
import InvalidIds from "@/components/project_page_errors/InvalidIds";
import ProjectNotFound from "@/components/project_page_errors/ProjectNotFound";
import SWR from "@/components/shared/SWR";
import { checkProjectAccessAndReturnData } from "@/lib/actions/project.actions";

export default async function projectDynamic({
  params,
}: {
  params: { project_id: string };
}) {
  const projectInfo = await checkProjectAccessAndReturnData(params.project_id);
  if (projectInfo.message === "not_found") {
    return <ProjectNotFound />;
  } else if (projectInfo.message === "member") {
    return <main>You are member</main>;
  } else if (projectInfo.message === "host") {
    return <main>You are host</main>;
  } else if (projectInfo.message === "invalid_ids") {
    return <InvalidIds />;
  } else if (projectInfo.message === "user_not_found") {
    return <InvalidIds />;
  } else if (projectInfo.message === "access_denied") {
    return <AccessDenied />;
  } else if (projectInfo.message === "swr") {
    return <SWR />;
  }
  // check user access
  // if host then render additional stuff
  // if member then render member stuff
  // if visitor then render Unauthorized access
  //   return <main className="wrapper">project page</main>
}

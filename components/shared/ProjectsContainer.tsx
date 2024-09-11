"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProjects } from "@/lib/actions/project.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IProject } from "@/lib/database/models/project.model";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
type ProjectsContainerProps = {
  type: "hosted" | "working";
};
import { Ellipsis } from "lucide-react";
import ProjectCardLoad from "../loaders/ProjectCardLoad";

const ProjectsContainer = ({ type }: ProjectsContainerProps) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch projects on initial load and when `type` changes
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const { projects: fetchedProjects, hasMoreProjects } =
          await getProjects(type, 1, 5); // Always fetch the first page
        if (isMounted) {
          setProjects(fetchedProjects);
          setHasMoreProjects(hasMoreProjects);
          setPage(1); // Reset to the first page
        }
      } catch (error) {
        console.error("Error fetching data SERVER ACTION PROJECTS:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted components
    };
  }, [type]); // Fetch data only when `type` changes

  // Function to handle pagination and loading more projects
  const handleShowMore = async () => {
    setLoadingMore(true); // Set loadingMore to true when loading more projects
    const nextPage = page + 1;
    try {
      const { projects: moreProjects, hasMoreProjects } = await getProjects(
        type,
        nextPage,
        5
      );
      setProjects((prevProjects) => [...prevProjects, ...moreProjects]);
      setPage(nextPage);
      setHasMoreProjects(hasMoreProjects);
    } catch (error) {
      console.error("Error fetching more projects:", error);
    } finally {
      setLoadingMore(false); // Set loadingMore to false after loading more projects
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading && <ProjectCardLoad count={5} />}
      {!loading && projects.length > 0 && (
        <>
          {projects.map((project) => (
            <Card
              className="min-h-40 hover:bg-primary/5 transition-all"
              key={project._id.toString()}
            >
              <Link href={`/project/${project._id.toString()}`}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {project.projectName}
                    {type === "hosted" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-0 onPrentHover"
                          >
                            <Ellipsis className="opacity-50 transition-all" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link
                              className="flex gap-4 items-center"
                              href={`/project/${project._id.toString()}/join-requests`}
                            >
                              Join requests
                              {project.joinRequests.length > 0 && (
                                <Badge>{project.joinRequests.length}</Badge>
                              )}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/project/${project._id.toString()}/members`}
                            >
                              Members
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/project/${project._id.toString()}/settings`}
                            >
                              Settings
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {project.projectDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  {project.joinRequests.length > 0 && (
                    <Link
                      href={`/project/${project._id.toString()}/join-requests`}
                    >
                      Join requests: {project.joinRequests.length}
                    </Link>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
          {loadingMore && <ProjectCardLoad count={5} />}
        </>
      )}
      {!loading && projects.length === 0 && (
        <p className="text-muted-foreground">No Projects to Show.</p>
      )}
      {!loading && hasMoreProjects && (
        <div className="min-h-40 flex justify-center items-center">
          <Button variant="link" onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsContainer;

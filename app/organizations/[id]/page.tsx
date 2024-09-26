import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Card, Heading } from "@radix-ui/themes";
import Link from "next/link";

export default async function OrganizationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-center text-red-700 font-medium">Not authenticated</div>;
  }
  const user = session.user;

  const organization = await prisma.organization.findUnique({
    where: { id: params.id },
    include: { 
      projects: {
        include: {
          _count: {
            select: { Issue: true }
          }
        }
      },
      organizationMemberships: {
        include: { user: true }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
  });

  if (!organization) return notFound();

  const isMember = organization.organizationMemberships.some(
    (m: any) => m.userId === user.id
  );
  
  if (!isMember) {
    return <div className="p-8 text-center text-red-700 font-medium">Not authorized to view this organization</div>;
  }

  const isCreator = organization.creatorId === user.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-light mb-2">
          <span className="text-3xl font-bold text-brand mb-2">Organization: </span> 
          {organization.name}
        </h1>
        <p className="text-brand text-base font-medium mb-2">
          <span className="text-brand-dark font-semibold text-lg">Created by: </span>
          {organization.creator?.name || organization.creator?.email || 'Unknown'}
        </p>
        <p className="text-brand text-base font-medium"> 
          <span className="text-brand-dark font-semibold text-lg">Members: </span>
           {organization.organizationMemberships.map((m: any) => m.user.name || m.user.email).join(', ')}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className="flex gap-5">
          {isCreator && (
            <Link 
              href={`/organizations/${organization.id}/edit`}
              className="bg-brand text-white px-4 py-3 rounded-xl hover:bg-brand transition text-lg font-semibold hover:scale-105"
            >
              Edit Organization
            </Link>
          )}
          <Link 
            href={`/organizations/${organization.id}/projects/new`}
            className="bg-gray-50 text-brand px-4 py-3 rounded-xl hover:bg-gray-100 transition text-lg font-semibold hover:scale-105 border border-brand"
          >
            New Project
          </Link>
        </div>
      </div>

      {organization.projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No projects found.</p>
          <Link 
            href={`/organizations/${organization.id}/projects/new`}
            className="text-brand hover:underline"
          >
            Create the first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organization.projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/organizations/${organization.id}/projects/${project.id}`}
              className="block"
            >
              <Card className="p-6 border border-brand-light hover:border-brand transition-all duration-200 hover:shadow-lg cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-brand-dark">{project.name}</h3>
                  <span className="text-sm text-brand-dark bg-brand-light/10 px-2 py-1 rounded">
                    {project._count.Issue} issues
                  </span>
                </div>
                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="text-xs text-gray-500">
                  Created {project.createdAt.toLocaleDateString()}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 
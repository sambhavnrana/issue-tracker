import Link from 'next/link'
import React from 'react'
import IssueStatusFilter from './IssueStatusFilter'
import ProjectFilter from './ProjectFilter'

const IssueActions = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <IssueStatusFilter />
                <ProjectFilter />
            </div>
            <Link 
                href="/issues/new"
                className="mr-12 mt-2 sm:mt-0 bg-brand text-white px-5 py-2 rounded-lg hover:bg-brand-dark transition-colors duration-200 font-medium text-center hover:scale-110 text-xl border shadow-xl hover:shadow-2xl"
            >
               <span className='font-bold text-2xl'>+</span> New Issue
            </Link>
        </div>
    )
}

export default IssueActions
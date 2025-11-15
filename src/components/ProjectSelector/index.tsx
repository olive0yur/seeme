'use client';

import Image from 'next/image';
import './index.css';

interface Project {
  id: string;
  name: string;
  thumbnail: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onProjectRemove: (projectId: string) => void;
  onAddProject: () => void;
  className?: string;
}

export default function ProjectSelector({
  projects,
  selectedProjectId,
  onProjectSelect,
  onProjectRemove,
  onAddProject,
  className = ''
}: ProjectSelectorProps) {
  return (
    <>
      {/* 添加按钮 */}
      <button className='add-but' onClick={onAddProject}>+</button>
      
      {/* 分割线 */}
      <div className='divider-line'></div>
      
      {/* 项目列表 */}
      <div className='project-list'>
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className={`project-item ${selectedProjectId === project.id ? 'project-item-selected' : ''}`}
            onClick={() => onProjectSelect(project.id)}
          >
            {/* 删除按钮 */}
            <Image 
              src="/minus.svg" 
              className='minus' 
              alt="close" 
              width={12} 
              height={12}
              onClick={(e) => {
                e.stopPropagation();
                onProjectRemove(project.id);
              }}
            />
            
            {/* 序号 */}
            <p className='project-item-index'>{index + 1}</p>
            
            {/* 项目图片 */}
            <Image 
              src={project.thumbnail} 
              className='project-item-image' 
              alt="project" 
              width={52} 
              height={52}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Projects from "@/components/pages/Projects";

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  className,
  projects = []
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'all');

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className={cn("relative rounded-2xl p-6 border", className)}
      style={{
        background: `
          linear-gradient(145deg, 
            rgba(255, 255, 255, 0.9) 0%,
            rgba(248, 250, 252, 0.95) 25%,
            rgba(241, 245, 249, 0.3) 50%,
            rgba(255, 255, 255, 0.9) 100%
          )
        `,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `
          0 8px 25px rgba(0, 0, 0, 0.08),
          0 4px 15px rgba(0, 0, 0, 0.05),
          inset 1px 1px 0 rgba(255, 255, 255, 0.2)
        `,
      }}
    >
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-30 rounded-2xl pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(59, 130, 246, 0.02) 0%,
              rgba(147, 51, 234, 0.01) 50%,
              rgba(236, 72, 153, 0.02) 100%
            )
          `,
          animation: 'gradient-shift 8s ease infinite',
        }}
      />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <ApperIcon name="Filter" size={18} className="text-primary" />
            </div>
            <span className="text-lg font-bold text-gray-900">Filters</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[140px]">
              <Select
                value={filters.status || "all"}
                onChange={e => onFilterChange("status", e.target.value)}
                className="w-full"
              >
                <option value="all">All Status</option>
                <option value="ToDo">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </Select>
            </div>
            
            <div className="min-w-[140px]">
              <Select
                value={filters.priority || "all"}
                onChange={e => onFilterChange("priority", e.target.value)}
                className="w-full"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>
            
            <div className="min-w-[140px]">
              <Select
                value={filters.project || "all"}
                onChange={e => onFilterChange("project", e.target.value)}
                className="w-full"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.Id} value={project.Id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        
        {hasActiveFilters && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-900 font-semibold"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Clear Filters
            </Button>
          </motion.div>
        )}
</div>
    </motion.div>
  );
};

export default FilterBar;
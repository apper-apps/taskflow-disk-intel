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
    className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-4", className)}>
    <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
                <ApperIcon name="Filter" size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-3">
                <Select
                    value={filters.status || "all"}
                    onChange={e => onFilterChange("status", e.target.value)}
                    className="w-auto min-w-[120px]">
                    <option value="all">All Status</option>
                    <option value="ToDo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                </Select>
                <Select
                    value={filters.priority || "all"}
                    onChange={e => onFilterChange("priority", e.target.value)}
                    className="w-auto min-w-[120px]">
                    <option value="all">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </Select>
                <Select
                    value={filters.project || "all"}
                    onChange={e => onFilterChange("project", e.target.value)}
                    className="w-auto min-w-[120px]">
                    <option value="all">All Projects</option>
                    {projects.map(project => <option key={project.Id} value={project.Id}>
                        {project.name}
                    </option>)}
                </Select>
            </div>
            {hasActiveFilters && <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.9
                }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-gray-600 hover:text-gray-900">
                    <ApperIcon name="X" size={14} className="mr-1" />Clear Filters
                                </Button>
            </motion.div>}
        </div>
    </div></motion.div>
  );
};

export default FilterBar;
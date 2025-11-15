import { useRef, useState, useEffect } from "react";
import Editor from "../BuilderPage/Editor";
import Preview from "../BuilderPage/Preview";
import Raw from "../BuilderPage/Raw";

export default function DashboardHome({
  activeTab,
  blocks,
  onBlocksChange,
  onBlockUpdate,
  onBlockDelete,
  onBlockAdd,
}) {
  const dropZoneRef= useRef(null);
  const [isDraggingFile, setIsDraggingFile]= useState(false);

  
  const handleDragOver=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

  const files= e.dataTransfer.files;
  if(files.length === 0) return;

  const file= files[0];
  const reader= new FileReader();
  reader.onload= (event)=>{
    const text= event.target.result;

  onBlocksChange([
    {
      id: Date.now(),
      type: "paragraph",
      content: text,
    },
  ]);
};
reader.readAsText(file);
};

useEffect(()=>{
window.addEventListener("dragover",handleDragOver);
window.addEventListener("drop",handleDrop);

return()=>{
  window.removeEventListener("dragover",handleDragOver);
  window.removeEventListener("drop",handleDrop);
};
},[onBlocksChange]);
  return (
    <div className="w-full h-full">
      <div 
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full h-[calc(100vh-8rem)] rounded-xl border bg-card shadow-sm overflow-hidden transition-all
        ${isDraggingFile?"bg-muted/40 border-dashed border-2 border-primary": ""}`}
        >
        {activeTab === "editor" && (
          <div className="w-full h-full">
            <Editor
              blocks={blocks}
              onBlockUpdate={onBlockUpdate}
              onBlockDelete={onBlockDelete}
              onBlockAdd={onBlockAdd}
              />
            </div>
          )}
      ref={dropZoneRef}
      className={`w-full h-[calc(100vh-8rem)] rounded-xl border bg-card shadow-sm overflow-hidden ${
      isDraggingFile ? "bg-muted/40 border-dashed border-2 border-primary" : ""
    }`}

        {activeTab === "preview" && (
          <div className="w-full h-full">
            <Preview blocks={blocks} />
          </div>
        )}

        {activeTab === "raw" && (
          <div className="w-full h-full">
            <Raw blocks={blocks} onBlocksChange={onBlocksChange} />
          </div>
        )}
      </div>
    </div>
  );
}

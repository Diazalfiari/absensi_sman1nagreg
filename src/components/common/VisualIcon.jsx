import React from 'react';

const VisualIcon = ({ name = 'dashboard', className = '' }) => {
  const baseClass = `pointer-events-none block shrink-0 ${className}`;

  if (name === 'calendar') {
    return (
      <span className={`${baseClass} relative h-4 w-4 rounded-[3px] border-2 border-current`} aria-hidden="true">
        <span className="absolute -top-1.5 left-1 h-1.5 w-0.5 rounded-full bg-current" />
        <span className="absolute -top-1.5 right-1 h-1.5 w-0.5 rounded-full bg-current" />
        <span className="absolute left-0.5 right-0.5 top-1.5 border-t border-current" />
      </span>
    );
  }

  if (name === 'history') {
    return (
      <span className={`${baseClass} relative h-4 w-4`} aria-hidden="true">
        <span className="absolute left-0.5 top-1 h-3 w-3 rounded-full border-2 border-current" />
        <span className="absolute left-1.5 top-0 h-1.5 w-1.5 border-l-2 border-t-2 border-current" />
        <span className="absolute left-2.5 top-1.5 h-1.5 w-0.5 origin-bottom rotate-[-35deg] rounded-full bg-current" />
        <span className="absolute left-2.5 top-2.5 h-0.5 w-1.5 rotate-[25deg] rounded-full bg-current" />
      </span>
    );
  }

  if (name === 'report') {
    return (
      <span className={`${baseClass} flex h-4 w-4 items-end justify-center gap-0.5`} aria-hidden="true">
        <span className="h-1.5 w-1 rounded-sm bg-current" />
        <span className="h-2.5 w-1 rounded-sm bg-current" />
        <span className="h-3.5 w-1 rounded-sm bg-current" />
      </span>
    );
  }

  if (name === 'users') {
    return (
      <span className={`${baseClass} relative h-4 w-4`} aria-hidden="true">
        <span className="absolute left-1 top-0.5 h-1.5 w-1.5 rounded-full border-2 border-current" />
        <span className="absolute left-0.5 top-2.5 h-1.5 w-3 rounded-t-full border-2 border-current border-b-0" />
        <span className="absolute right-0.5 top-1.5 h-1.5 w-1.5 rounded-full border border-current" />
        <span className="absolute right-0 top-3 h-1 w-1.5 rounded-t-full border border-current border-b-0" />
      </span>
    );
  }

  if (name === 'class') {
    return (
      <span className={`${baseClass} relative h-4 w-4 rounded-sm border-2 border-current`} aria-hidden="true">
        <span className="absolute left-1 top-1 h-0.5 w-2 rounded-full bg-current" />
        <span className="absolute left-1 top-2 h-0.5 w-1.5 rounded-full bg-current" />
        <span className="absolute bottom-1 left-1 h-0.5 w-2 rounded-full bg-current" />
      </span>
    );
  }

  if (name === 'book') {
    return (
      <span className={`${baseClass} relative h-4 w-4`} aria-hidden="true">
        <span className="absolute left-0.5 top-1 h-3 w-1.5 rounded-l-sm border-2 border-current border-r-0" />
        <span className="absolute right-0.5 top-1 h-3 w-1.5 rounded-r-sm border-2 border-current border-l-0" />
        <span className="absolute left-1/2 top-1 h-3 -translate-x-1/2 border-l border-current" />
      </span>
    );
  }

  if (name === 'task') {
    return (
      <span className={`${baseClass} relative h-4 w-4 rounded-sm border-2 border-current`} aria-hidden="true">
        <span className="absolute left-1 top-1.5 h-1.5 w-2.5 rotate-[-45deg] border-b-2 border-l-2 border-current" />
      </span>
    );
  }

  if (name === 'info') {
    return (
      <span className={`${baseClass} relative h-4 w-4 rounded-full border-2 border-current`} aria-hidden="true">
        <span className="absolute left-1/2 top-1 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-current" />
        <span className="absolute bottom-1 left-1/2 h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-current" />
      </span>
    );
  }

  if (name === 'upload') {
    return (
      <span className={`${baseClass} relative h-4 w-4`} aria-hidden="true">
        <span className="absolute bottom-0.5 left-1 h-1 w-2.5 rounded-sm border-2 border-current border-t-0" />
        <span className="absolute left-1.5 top-0.5 h-2.5 w-1 rotate-45 border-l-2 border-t-2 border-current" />
      </span>
    );
  }

  if (name === 'play') {
    return (
      <span className={`${baseClass} ml-0.5 h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-current`} aria-hidden="true" />
    );
  }

  if (name === 'question') {
    return (
      <span className={`${baseClass} relative h-4 w-4 rounded-full border-2 border-current`} aria-hidden="true">
        <span className="absolute bottom-1 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-current" />
        <span className="absolute left-1/2 top-1 h-1.5 w-1 -translate-x-1/2 rounded-t-full border-t-2 border-current" />
      </span>
    );
  }

  if (name === 'message') {
    return (
      <span className={`${baseClass} relative h-4 w-4 rounded-[3px] border-2 border-current`} aria-hidden="true">
        <span className="absolute -bottom-1 left-1 h-1.5 w-1.5 rotate-[-35deg] border-b-2 border-l-2 border-current bg-inherit" />
        <span className="absolute left-1 top-1 h-0.5 w-2 rounded-full bg-current" />
        <span className="absolute left-1 top-2 h-0.5 w-1.5 rounded-full bg-current" />
      </span>
    );
  }

  if (name === 'logout') {
    return (
      <span className={`${baseClass} relative h-4 w-4 rounded-full border-2 border-current`} aria-hidden="true">
        <span className="absolute -right-1 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded-full bg-current" />
        <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-current" />
        <span className="absolute left-1/2 top-0 h-1.5 w-0.5 -translate-x-1/2 bg-zinc-800" />
      </span>
    );
  }

  return (
    <span className={`${baseClass} grid h-4 w-4 grid-cols-2 gap-0.5`} aria-hidden="true">
      <span className="rounded-[2px] bg-current" />
      <span className="rounded-[2px] bg-current" />
      <span className="rounded-[2px] bg-current" />
      <span className="rounded-[2px] bg-current" />
    </span>
  );
};

export default VisualIcon;

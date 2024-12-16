"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [tasks, setTasks] = useState<
    { text: string; completed: boolean; id: string }[]
  >([]);
  const [task, setTask] = useState<string>("");

  const { data, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetch("/api").then(res => res.json())
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const handleAddTask = () => {
    setTask("");
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({ text: task })
    }).then(() => refetch());
  };

  const handleDeleteTask = (index: number) => {
    fetch("/api", {
      method: "DELETE",
      body: JSON.stringify({ id: tasks[index].id })
    }).then(() => refetch());
  };

  const handleToggleTask = (index: number) => {
    const task = tasks[index];

    fetch("/api", {
      method: "PATCH",
      body: JSON.stringify({ id: task.id, completed: !task.completed })
    }).then(() => refetch());
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-2 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">To Do List</h1>
        <p className="text-sm text-gray-500">With backend</p>
      </div>

      <div className="flex flex-row gap-4 mt-4 w-full max-w-md">
        <Input
          placeholder="Enter your task"
          value={task}
          onChange={e => setTask(e.target.value)}
          className="flex-1"
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
        />
        <Button onClick={handleAddTask} className="flex-none">
          Add
        </Button>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-md mt-6">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex flex-row gap-2 items-center p-2 border-b border-gray-200"
          >
            <Checkbox
              checked={task.completed}
              onClick={() => handleToggleTask(index)}
            />
            <p
              className={`flex-1 text-left ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.text}
            </p>
            <Button
              onClick={() => handleDeleteTask(index)}
              variant="destructive"
              size="icon"
              className="p-1"
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const prisma = new PrismaClient();

export async function GET() {
  console.log("GET");
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const task = await prisma.task.create({
    data: {
      text
    }
  });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const task = await prisma.task.delete({
    where: { id }
  });
  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  const { id, completed } = await req.json();
  const task = await prisma.task.update({
    where: { id },
    data: { completed }
  });
  return NextResponse.json(task);
}

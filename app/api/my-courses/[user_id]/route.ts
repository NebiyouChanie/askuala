import { NextRequest, NextResponse } from "next/server";
import { findMany } from "@/lib/db";


export async function GET(_request: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
    const { user_id } = await params
    const tutors = await findMany('tutors',{user_id})
    const tutees = await findMany('tutees',{user_id})
    const trainings = await findMany('trainings',{user_id})
    const researches = await findMany('researches',{user_id})
    const entrepreneurships = await findMany('entrepreneurships',{user_id})
    const courses = [...tutors, ...tutees, ...trainings, ...researches, ...entrepreneurships]
    
    return NextResponse.json({courses})
}
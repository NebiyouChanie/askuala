import { NextRequest, NextResponse } from "next/server";
import { findMany, findOne } from "@/lib/db";


export async function GET(request: NextRequest,{params}:{params:{user_id:string}}) {
    const {user_id} = params
    const tutors = await findMany('tutors',{user_id})
    const tutees = await findMany('tutees',{user_id})
    const trainings = await findMany('trainings',{user_id})
    const researches = await findMany('researches',{user_id})
    const entrepreneurships = await findMany('entrepreneurships',{user_id})
    const courses = [...tutors, ...tutees, ...trainings, ...researches, ...entrepreneurships]
    console.log("🚀 ~ GET ~ courses:", courses)
    
    return NextResponse.json({courses})
}
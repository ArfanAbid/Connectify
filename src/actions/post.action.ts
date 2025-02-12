"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
    try {
        const userId = await getDbUserId();
        if (!userId) return;

        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId
            }
        })
        revalidatePath('/');
        return { success: true,post }
    } catch (error) {
        console.error("Failed to create post:", error);
        return { success: false, error: "Failed to create post" }; 
    }
}

export async function getPosts() {
    try {
        const posts=await prisma.post.findMany({
            orderBy:{
                createdAt:"desc"
            },
            include: {
                author: {
                  select: {
                    name: true,
                    username: true,
                    image: true,
                  },
                },
                comments: {
                    include:{
                        author:{
                            select:{
                                id:true,
                                name:true,
                                username:true,
                                image:true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                likes:{
                    select:{
                        userId:true,
                    }
                },
                _count: {
                    select: {
                      comments: true,
                      likes: true,
                    },
                  },
              },
        })

        return posts;
    } catch (error) {
        console.error("Failed to get posts:", error);
        throw new Error("Failed to get posts");
    }
}
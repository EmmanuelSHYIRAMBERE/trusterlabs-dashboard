"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function updateProfilePhoto(
  userId: string,
  imageUrl: string,
): Promise<{ success: boolean; error?: string; imageUrl?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl, updatedAt: new Date() },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error updating profile photo:", error);
    return { success: false, error: "Failed to update profile photo" };
  }
}

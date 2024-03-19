"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Wave from "../models/wave.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createWave({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdWave = await Wave.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { waves: createdWave._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating wave: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the posts that have no parents (top-level waves...)
  const postsQuery = Wave.find({ parentId: { $in: [null, undefined] } })
    .sort({
      createdAt: "desc",
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Wave.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;
  return { posts, isNext };
}

export async function fetchWaveById(id: string) {
  connectToDB();

  try {
    // TODO: Populate Community
    const wave = await Wave.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Wave,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return wave;
  } catch (error: any) {
    throw new Error(`Error fetching wave: ${error.message}`);
  }
}

export async function addCommentToWave(
  waveId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original wave by its ID
    const originalWave = await Wave.findById(waveId);

    if (!originalWave) {
      throw new Error("Wave not found");
    }

    // Create a new Wave with the comment text
    const commentWave = new Wave({
      text: commentText,
      author: userId,
      parentId: waveId,
    });

    // Save the new Wave
    const savedCommentWave = await commentWave.save();

    // Update the original Wave to include the new comment
    originalWave.children.push(savedCommentWave._id);

    // Save the original wave
    await originalWave.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to wave: ${error.message}`);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  verifyPassword,
  isAdmin,
  setAdminCookie,
  clearAdminCookie,
} from "@/lib/admin";
import {
  createShow,
  updateShow,
  deleteShow,
  setShowArchived,
} from "@/lib/shows";
import { createVideo, updateVideo, deleteVideo } from "@/lib/videos";
import { parseYoutubeId } from "@/lib/youtube";
import { upsertAlbum, deleteAlbum, updateAlbumTracks } from "@/lib/albums";
import { parseSpotifyAlbumId, fetchSpotifyAlbum } from "@/lib/spotify";

export async function login(_previousState: unknown, formData: FormData) {
  const password = formData.get("password") as string;

  if (!password || !verifyPassword(password)) {
    return { error: "Access denied" };
  }

  await setAdminCookie();
  revalidatePath("/admin", "layout");

  return { error: "" };
}

export async function logout() {
  await clearAdminCookie();
  revalidatePath("/admin", "layout");
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatShowDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
}

const ShowSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date is required" })
    .transform(formatShowDate),
  city: z.string().trim().min(1, { message: "City is required" }),
  venue: z.string().trim().min(1, { message: "Venue is required" }),
  ticketLink: z
    .string()
    .trim()
    .url({ message: "Ticket link must be a valid URL" })
    .or(z.literal("")),
  soldOut: z.boolean(),
});

export type ShowFormState = {
  errors: {
    date?: string[];
    city?: string[];
    venue?: string[];
    ticketLink?: string[];
    form?: string[];
  };
  success: boolean;
};

export async function saveShow(
  _previousState: unknown,
  formData: FormData,
): Promise<ShowFormState> {
  if (!(await isAdmin())) {
    return { errors: { form: ["Not authorized"] }, success: false };
  }

  const id = Number(formData.get("id") || 0);

  const validatedFields = ShowSchema.safeParse({
    date: formData.get("date"),
    city: formData.get("city"),
    venue: formData.get("venue"),
    ticketLink: formData.get("ticketLink"),
    soldOut: formData.get("soldOut") === "on",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  if (id) {
    await updateShow(id, validatedFields.data);
  } else {
    await createShow(validatedFields.data);
  }

  revalidatePath("/shows");
  revalidatePath("/admin/shows");

  return { errors: {}, success: true };
}

export async function archiveShow(formData: FormData) {
  if (!(await isAdmin())) {
    return;
  }

  const id = Number(formData.get("id"));
  const archived = formData.get("archived") === "true";

  if (id) {
    await setShowArchived(id, archived);
  }

  revalidatePath("/shows");
  revalidatePath("/admin/shows");
}

export async function removeShow(formData: FormData) {
  if (!(await isAdmin())) {
    return;
  }

  const id = Number(formData.get("id"));

  if (id) {
    await deleteShow(id);
  }

  revalidatePath("/shows");
  revalidatePath("/admin/shows");
}

const VideoSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  url: z
    .string()
    .trim()
    .min(1, { message: "URL is required" })
    .refine((value) => parseYoutubeId(value) !== null, {
      message: "Could not find a Youtube video ID in that URL",
    })
    .transform((value) => parseYoutubeId(value) as string),
});

export type VideoFormState = {
  errors: {
    name?: string[];
    url?: string[];
    form?: string[];
  };
  success: boolean;
};

export async function saveVideo(
  _previousState: unknown,
  formData: FormData
): Promise<VideoFormState> {
  if (!(await isAdmin())) {
    return { errors: { form: ["Not authorized"] }, success: false };
  }

  const originalId = formData.get("originalId") as string;

  const validatedFields = VideoSchema.safeParse({
    name: formData.get("name"),
    url: formData.get("url"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  if (originalId) {
    await updateVideo(originalId, validatedFields.data);
  } else {
    await createVideo(validatedFields.data);
  }

  revalidatePath("/videos");
  revalidatePath("/admin/videos");

  return { errors: {}, success: true };
}

export async function removeVideo(formData: FormData) {
  if (!(await isAdmin())) {
    return;
  }

  const id = formData.get("originalId") as string;

  if (id) {
    await deleteVideo(id);
  }

  revalidatePath("/videos");
  revalidatePath("/admin/videos");
}

export type AlbumFormState = {
  errors: {
    id?: string[];
    form?: string[];
  };
  success: boolean;
};

export async function saveAlbum(
  _previousState: unknown,
  formData: FormData
): Promise<AlbumFormState> {
  if (!(await isAdmin())) {
    return { errors: { form: ["Not authorized"] }, success: false };
  }

  const input = (formData.get("id") as string) || "";
  const albumId = parseSpotifyAlbumId(input);

  if (!albumId) {
    return {
      errors: { id: ["Could not find a Spotify album ID in that URL"] },
      success: false,
    };
  }

  try {
    const album = await fetchSpotifyAlbum(albumId);
    await upsertAlbum(album);
  } catch (error) {
    return {
      errors: {
        form: [error instanceof Error ? error.message : "Something went wrong"],
      },
      success: false,
    };
  }

  revalidatePath("/music");
  revalidatePath("/admin/music");

  return { errors: {}, success: true };
}

export async function refreshAlbum(formData: FormData) {
  if (!(await isAdmin())) {
    return;
  }

  const id = formData.get("id") as string;

  if (!id) {
    return;
  }

  const album = await fetchSpotifyAlbum(id);
  await upsertAlbum(album);

  revalidatePath("/music");
  revalidatePath("/admin/music");
}

const TrackSchema = z.object({
  trackNo: z.coerce.number().int().min(1),
  title: z.string().trim().min(1),
  durationMS: z.coerce.number().int().min(0),
  id: z.string().trim().min(1),
});

export async function saveAlbumTracks(
  _previousState: unknown,
  formData: FormData
): Promise<AlbumFormState> {
  if (!(await isAdmin())) {
    return { errors: { form: ["Not authorized"] }, success: false };
  }

  const albumId = formData.get("albumId") as string;

  if (!albumId) {
    return { errors: { form: ["Missing album ID"] }, success: false };
  }

  const trackNos = formData.getAll("trackNo");
  const titles = formData.getAll("trackTitle");
  const durations = formData.getAll("trackDurationMS");
  const ids = formData.getAll("trackId");

  const validatedTracks = z.array(TrackSchema).safeParse(
    trackNos.map((trackNo, index) => ({
      trackNo,
      title: titles[index],
      durationMS: durations[index],
      id: ids[index],
    }))
  );

  if (!validatedTracks.success) {
    return {
      errors: {
        form: [
          "Please check the track fields - every track needs a number, title, duration, and ID",
        ],
      },
      success: false,
    };
  }

  await updateAlbumTracks(albumId, validatedTracks.data);

  revalidatePath("/music");
  revalidatePath("/admin/music");

  return { errors: {}, success: true };
}

export async function removeAlbum(formData: FormData) {
  if (!(await isAdmin())) {
    return;
  }

  const id = formData.get("id") as string;

  if (id) {
    await deleteAlbum(id);
  }

  revalidatePath("/music");
  revalidatePath("/admin/music");
}

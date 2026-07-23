import sql from "@/lib/db";

export type Video = {
  id: string;
  name: string;
  url: string;
};

export async function getVideos(): Promise<Video[]> {
  const rows = await sql<Video[]>`
    SELECT id, name, url
    FROM godhandusa.videos
    ORDER BY position ASC
  `;

  return rows.map(({ id, name, url }) => ({ id, name, url }));
}

export async function createVideo(video: Omit<Video, "id">): Promise<void> {
  await sql`
    INSERT INTO godhandusa.videos (id, name, url)
    VALUES (${crypto.randomUUID()}, ${video.name}, ${video.url})
  `;
}

export async function updateVideo(
  id: string,
  video: Omit<Video, "id">
): Promise<void> {
  await sql`
    UPDATE godhandusa.videos
    SET name = ${video.name},
        url = ${video.url}
    WHERE id = ${id}
  `;
}

export async function deleteVideo(id: string): Promise<void> {
  await sql`DELETE FROM godhandusa.videos WHERE id = ${id}`;
}

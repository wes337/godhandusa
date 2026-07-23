import sql from "@/lib/db";

export type Show = {
  id: number;
  date: string;
  city: string;
  venue: string;
  ticketLink: string;
  soldOut: boolean;
  archived: boolean;
};

export type ShowInput = Omit<Show, "id" | "archived">;

type ShowRow = {
  id: number;
  date: string;
  city: string;
  venue: string;
  ticket_link: string;
  sold_out: boolean;
  archived: boolean;
};

function showTime(show: Show): number {
  const time = Date.parse(show.date);
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

function sortByDate(shows: Show[]): Show[] {
  return shows.sort((a, b) => showTime(a) - showTime(b));
}

function toShow(row: ShowRow): Show {
  return {
    id: row.id,
    date: row.date,
    city: row.city,
    venue: row.venue,
    ticketLink: row.ticket_link,
    soldOut: row.sold_out,
    archived: row.archived,
  };
}

export async function getShows(): Promise<Show[]> {
  const rows = await sql<ShowRow[]>`
    SELECT id, date, city, venue, ticket_link, sold_out, archived
    FROM godhandusa.shows
    WHERE NOT archived
    ORDER BY id ASC
  `;

  return sortByDate(rows.map(toShow));
}

export async function getAllShows(): Promise<Show[]> {
  const rows = await sql<ShowRow[]>`
    SELECT id, date, city, venue, ticket_link, sold_out, archived
    FROM godhandusa.shows
    ORDER BY id ASC
  `;

  return sortByDate(rows.map(toShow));
}

export async function createShow(show: ShowInput): Promise<Show> {
  const [row] = await sql<ShowRow[]>`
    INSERT INTO godhandusa.shows (date, city, venue, ticket_link, sold_out)
    VALUES (${show.date}, ${show.city}, ${show.venue}, ${show.ticketLink}, ${show.soldOut})
    RETURNING id, date, city, venue, ticket_link, sold_out, archived
  `;

  return toShow(row);
}

export async function updateShow(
  id: number,
  show: ShowInput
): Promise<Show | null> {
  const [row] = await sql<ShowRow[]>`
    UPDATE godhandusa.shows
    SET date = ${show.date},
        city = ${show.city},
        venue = ${show.venue},
        ticket_link = ${show.ticketLink},
        sold_out = ${show.soldOut}
    WHERE id = ${id}
    RETURNING id, date, city, venue, ticket_link, sold_out, archived
  `;

  return row ? toShow(row) : null;
}

export async function setShowArchived(
  id: number,
  archived: boolean
): Promise<void> {
  await sql`
    UPDATE godhandusa.shows
    SET archived = ${archived}
    WHERE id = ${id}
  `;
}

export async function deleteShow(id: number): Promise<void> {
  await sql`DELETE FROM godhandusa.shows WHERE id = ${id}`;
}

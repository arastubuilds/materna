import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils";

export const posts = pgTable("posts", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

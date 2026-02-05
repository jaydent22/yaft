import { z } from "zod";

export const DayTypeEnum = z.enum(["rest", "exercise"]);

export type DayType = z.infer<typeof DayTypeEnum>;
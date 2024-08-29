/**
 * Interface representing a participation record in the Olympics.
 */
export interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

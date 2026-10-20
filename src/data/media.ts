import { pieces, type Piece } from "./portfolio"

/** The opening frame. A still from the concept film, used only as the hero
 *  and as the reel's handoff panel — it is not portfolio work in its own
 *  right, so it does not appear in `pieces` or in any filter. */
export const heroFrame = {
  poster: "/images/posters/hero.jpg",
  ratio: "16 / 9",
  focus: "40% 46%",
  focusWide: "58% 42%",
  alt: "A woman seen through a car window, trees and a pale stone structure behind her.",
}

const byId = new Map(pieces.map((piece) => [piece.id, piece]))

export function piece(id: string): Piece | undefined {
  return byId.get(id)
}

export function piecesIn(ids: readonly string[]): Piece[] {
  return ids.map((id) => byId.get(id)).filter((item): item is Piece => Boolean(item))
}

/**
 * Ícone do sprite SVG original do site (assets-viviane/img/icons.svg),
 * agora servido de /images/icons.svg. Traço grosso 48×48 da marca.
 */
export function SpriteIcon({ name }: { name: string }) {
  return (
    <svg aria-hidden="true" focusable="false">
      <use href={`/images/icons.svg#${name}`} />
    </svg>
  );
}

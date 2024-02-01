import Image from 'next/image';
import Link from 'next/link';
import { getAnimalsInsecure } from '../../database/animals';

export default async function AnimalsPage() {
  const animals = await getAnimalsInsecure();

  return (
    <div>
      <h1>These are my animals</h1>

      {animals.map((animal) => {
        return (
          <div
            key={`animal-div-${animal.id}`}
            data-test-id={`animal-type-${animal.type}`}
          >
            <Link href={`/animals/${animal.id}`}>
              <div>{animal.firstName}</div>
              <Image
                src={`/images/${animal.firstName}.png`}
                alt={animal.firstName}
                width={200}
                height={200}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

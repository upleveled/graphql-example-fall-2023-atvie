import { gql } from '@apollo/client';
import Image from 'next/image';
import { getClient } from '../util/apolloClient';
import styles from './page.module.css';

export type GitHubProfileResponse = {
  user: {
    name: string;
    avatarUrl: string;
    repositories: {
      edges: {
        node: {
          id: string;
          name: string;
          defaultBranchRef: {
            name: string;
          };
        };
      }[];
    };
  };
};

export default async function Home() {
  const { data } = await getClient().query<GitHubProfileResponse>({
    query: gql`
      query GithubProfile($username: String = "Eprince-hub") {
        user(login: $username) {
          name
          avatarUrl
          repositories(first: 10) {
            edges {
              node {
                id
                name
                defaultBranchRef {
                  name
                }
              }
            }
          }
        }
      }
    `,
  });

  return (
    <main className={styles.main}>
      <h1> My GitHub Profile</h1>
      <br />

      <Image
        src={data.user.avatarUrl}
        alt={`Avatar for ${data.user.name}`}
        width={400}
        height={400}
      />
      <h2>I am {data.user.name}</h2>

      <strong>
        Listing my first {data.user.repositories.edges.length} Repositories
        below
      </strong>

      <ul>
        {data.user.repositories.edges.map((repository) => {
          return (
            <li key={`${repository.node.name}-${repository.node.id}`}>
              {repository.node.name} / ({repository.node.defaultBranchRef.name})
            </li>
          );
        })}
      </ul>
    </main>
  );
}

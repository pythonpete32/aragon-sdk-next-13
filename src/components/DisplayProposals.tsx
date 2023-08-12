import { getAragonClients } from "@/lib/aragon";

interface Props {
  chainId?: number;
}

export default async function DisplayProposals({ chainId = 1 }: Props) {
  const { tokenVotingClient } = getAragonClients(chainId);

  const proposals = await tokenVotingClient.methods.getProposals({
    limit: 10,
    daoAddressOrEns: "aa.dao.eth",
  });

  console.log({ proposals });

  return (
    <div>
      <h1>Proposals</h1>
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal.id}>
            <p>{proposal.metadata?.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

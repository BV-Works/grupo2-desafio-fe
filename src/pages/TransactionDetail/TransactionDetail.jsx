import { useParams } from "react-router-dom";

function TransactionDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Transaction Detail</h1>
      <p>Transaction ID: {id}</p>
    </div>
  );
}

export default TransactionDetailPage;
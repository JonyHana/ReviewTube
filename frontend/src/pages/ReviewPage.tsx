import { useParams } from 'react-router-dom';

const ReviewPage = ({ reviews }: { reviews: any[] }) => {
  const { id } = useParams();
  
  return (
    <div>
      <h2>ReviewPage of {id}</h2>
      <div>
      </div>
    </div>
  )
}

export default ReviewPage;

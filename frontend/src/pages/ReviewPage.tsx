import { useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { id } = useParams();

  return (
    <div>
      ReviewPage of {id}
    </div>
  )
}

export default ReviewPage
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components/macro';
import { useLocation, useParams, Link } from 'react-router-dom';

import Card from '../Card/Card';
import { Loader } from '../Loader';
import { getUser } from '../../api';
import { prefix } from '../../titleGenerator';
import { Mentor, User } from '../../types/models';
import { useNavigation } from '../../hooks/useNavigation';
import { mobile } from '../../Me/styles/shared/devices';
import { useFilters } from '../../context/filtersContext/FiltersContext';

type UserProfileProps = {
  favorites: string[];
  onFavMentor(mentor: Mentor): void;
};

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding: 0 18px;

  @media ${mobile} {
    width: 100%;
  }
`;

const UserProfileLoader = styled(Loader)`
  font-size: 1.5rem;
  margin-top: 15px;
`;

export const UserProfile = ({ favorites, onFavMentor }: UserProfileProps) => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation<{ mentor: Mentor }>();
  const { id } = useParams<{ id: string }>();
  const { getPreviousRoute } = useNavigation();
  const [, dispatch] = useFilters();

  useEffect(() => {
    dispatch({ type: 'showFilters', payload: false });
  }, [dispatch]);

  useEffect(() => {
    async function fetchMentorIfNeed() {
      if (!location.state?.mentor) {
        const userFromAPI = await getUser(id);
        if (userFromAPI) {
          setUser(userFromAPI);
        }
        setIsLoading(false);
      }
    }
    fetchMentorIfNeed();
  }, [id, location.state]);

  if (isLoading) {
    return <UserProfileLoader size={2} />;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <UserProfileContainer>
      <Helmet>
        <title>{`${prefix} | ${user?.name}`}</title>
      </Helmet>
      <Link to={getPreviousRoute()}>Back to mentors list</Link>
      <Card
        appearance="extended"
        mentor={user}
        onFavMentor={onFavMentor}
        isFav={favorites.indexOf(user._id) > -1}
      />
    </UserProfileContainer>
  );
};

import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import api from '../../services/api';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dahsboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputErro, setInputError] = useState('');
  const [repositories, setReposistories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem('repositories');

    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddReposistories(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!newRepo) {
      setInputError('Digite o nome do repositório');
      return;
    }

    try {
      const response = await api.get(`repos/${newRepo}`);
      const repository = response.data;
      setReposistories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro ao buscar repositório');
    }
  }

  return (
    <>
      <img alt="logo" src={logo} />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputErro} onSubmit={handleAddReposistories}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputErro && <Error>{inputErro}</Error>}

      <Repositories>
        {repositories.map((repo) => (
          <Link key={repo.full_name} to={`/repository/${repo.full_name}`}>
            <img src={repo.owner.avatar_url} alt="profile" />

            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dahsboard;

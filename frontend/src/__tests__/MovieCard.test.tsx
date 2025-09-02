import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from '../MovieCard';

describe('MovieCard Component', () => {
  const mockMovie = {
    id: 1,
    title: 'Example Movie',
    overview: 'This is a test overview for the example movie.',
    poster_path: '/example_poster.jpg',
    release_date: '2023-10-27',
    vote_average: 7.5,
    vote_count: 120,
  };

  test('renders movie title and poster', () => {
    render(<MovieCard movie={mockMovie} />);

    // Assert that the movie title is rendered on the card
    expect(screen.getByText('Example Movie')).toBeInTheDocument();

    // Assert that the poster image is rendered with the correct src and alt text
    const poster = screen.getByRole('img', { name: 'Example Movie' });
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/example_poster.jpg');
  });

  test('handles missing poster image gracefully', () => {
    const movieWithNoPoster = { ...mockMovie, poster_path: null };
    render(<MovieCard movie={movieWithNoPoster} />);

    // Assert that the placeholder image is used
    const placeholderImage = screen.getByRole('img', { name: 'Example Movie' });
    expect(placeholderImage).toBeInTheDocument();
    expect(placeholderImage).toHaveAttribute('src', 'https://via.placeholder.com/500x750?text=No+Image');
  });

  test('opens and closes modal on click', async () => {
    render(<MovieCard movie={mockMovie} />);
    const user = userEvent.setup();

    // The modal should not be in the document initially
    expect(screen.queryByText(/This is a test overview/i)).not.toBeInTheDocument();

    // Simulate a click on the card to open the modal
    await user.click(screen.getByText('Example Movie'));

    // Assert that the modal content is now visible
    expect(screen.getByText(/This is a test overview/i)).toBeInTheDocument();
    expect(screen.getByText('Release Date: 2023-10-27')).toBeInTheDocument();
    expect(screen.getByText('Rating: 7.5 (120 votes)')).toBeInTheDocument();
    
    // Simulate pressing the Escape key to close the modal
    await user.keyboard('{Escape}');

    // Wait for the modal content to disappear from the document
    await waitFor(() => {
      expect(screen.queryByText(/This is a test overview/i)).not.toBeInTheDocument();
    });
  });

  test('handles missing details in modal gracefully', async () => {
    const movieWithMissingDetails = {
      ...mockMovie,
      overview: '',
      vote_average: null,
      vote_count: null,
      release_date: '',
    };
    render(<MovieCard movie={movieWithMissingDetails} />);
    const user = userEvent.setup();

    // Open the modal
    await user.click(screen.getByText('Example Movie'));

    // Assert that placeholder text is displayed
    expect(screen.getByText('No description available.')).toBeInTheDocument();
    expect(screen.getByText('Release Date: N/A')).toBeInTheDocument();
    expect(screen.getByText('Rating: N/A (0 votes)')).toBeInTheDocument();
  });
});

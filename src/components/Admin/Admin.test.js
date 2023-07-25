import { render, screen } from '@testing-library/react'
import Admin from './Admin'

test('Renders a h2 with correct text', () => {
    render(<Admin />)
    const h2 = screen.getByText('Admin')
    expect(h2).toBeInTheDocument()
})
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import AdminTable from './AdminTable'

describe('AdminTable', () => {
    // Mock the fetchAdminData function
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        { id: 1, name: 'Aishwarya Naik', email: 'aishwarya@mailinator.com', role: 'member' },
                        { id: 2, name: 'Arvind Kumar', email: 'arvind@mailinator.com', role: 'admin' },
                        { id: 3, name: 'Caterina Binotto', email: 'caterina@mailinator.com', role: 'member' },
                        { id: 4, name: 'Chetan Kumar', email: 'chetan@mailinator.com', role: 'member' },
                        { id: 5, name: 'Jim McClain', email: 'jim@mailinator.com', role: 'member' },
                        { id: 6, name: 'Mahaveer Singh', email: 'mahaveer@mailinator.com', role: 'member' },
                        { id: 7, name: 'Rahul Jain', email: 'rahul@mailinator.com', role: 'admin' },
                        { id: 8, name: 'Rizan Khan', email: 'rizan@mailinator.com', role: 'member' },
                        { id: 9, name: 'Sarah Potter', email: 'sarah@mailinator.com', role: 'admin' },
                        { id: 10, name: 'Keshav Muddaiah', email: 'keshav@mailinator.com', role: 'member' },
                        { id: 11, name: 'Nita Ramesh', email: 'nita@mailinator.com', role: 'member' },
                        { id: 12, name: 'Julia Hunstman', email: 'julia@mailinator.com', role: 'member' },
                        { id: 13, name: 'Juan Alonso', email: 'juan@mailinator.com', role: 'admin' },
                    ]),
            })
        );
    });

    // Restore the fetch function
    afterEach(() => {
        global.fetch.mockRestore();
    });

    it('should render the table with initial data', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('aishwarya@mailinator.com')).toBeInTheDocument();

            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
            expect(screen.getByText('arvind@mailinator.com')).toBeInTheDocument();
        });
    });

    it('should filter the table based on search text', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const searchInput = screen.getByPlaceholderText('Search by name, email or role');

        fireEvent.change(searchInput, {
            target: {
                value: 'Aishwarya',
            },
        })

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.queryByText('Arvind Kumar')).not.toBeInTheDocument();
        })
    })


    it('should display text inputs when the edit button is clicked', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const editButton = screen.getByTestId('editButton-1');

        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByTestId('editName-1')).toBeInTheDocument();
            expect(screen.getByTestId('editEmail-1')).toBeInTheDocument();
            expect(screen.getByTestId('editRole-1')).toBeInTheDocument();
        })
    })

    it('should edit a row upon clicking the edit button', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const editButton = screen.getByTestId('editButton-1');

        fireEvent.click(editButton);

        const nameInput = screen.getByTestId('editName-1');
        fireEvent.change(nameInput, {
            target: {
                value: 'Aishwarya updated',
            },
        })

        const acceptButton = screen.getByTestId('acceptButton-1');
        fireEvent.click(acceptButton);

        await waitFor(() => {
            expect(screen.getByText('Aishwarya updated')).toBeInTheDocument();
        })
    })

    it('should delete a row upon clicking the delete button', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const deleteButton = screen.getByTestId('deleteButton-1');

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText('Aishwarya Naik')).not.toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })
    })

    it('should display the first page of the data by default', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
            expect(screen.queryByText('Juan Alonso')).not.toBeInTheDocument();
        })
    })

    it('should display the next page of data when the next button is clicked', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const nextButton = screen.getByTestId('nextPage');

        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText('Juan Alonso')).toBeInTheDocument();
            expect(screen.queryByText('Aishwarya Naik')).not.toBeInTheDocument();
        })
    })

    it('should display the previous page of data when the previous button is clicked', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const nextButton = screen.getByTestId('nextPage');

        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText('Juan Alonso')).toBeInTheDocument();
            expect(screen.queryByText('Aishwarya Naik')).not.toBeInTheDocument();
        })

        const previousButton = screen.getByTestId('previousPage');

        fireEvent.click(previousButton);

        await waitFor(() => {
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
            expect(screen.queryByText('Juan Alonso')).not.toBeInTheDocument();
        })

    })

    it('should display the last page of data when the last button is clicked', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const lastButton = screen.getByTestId('lastPage');

        fireEvent.click(lastButton);

        await waitFor(() => {
            expect(screen.getByText('Juan Alonso')).toBeInTheDocument();
            expect(screen.queryByText('Aishwarya Naik')).not.toBeInTheDocument();
        })
    })

    it('should display zero rows when random characters are entered', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const searchInput = screen.getByPlaceholderText('Search by name, email or role');

        fireEvent.change(searchInput, {
            target: {
                value: 'asdf',
            },
        })

        await waitFor(() => {
            expect(screen.queryByText('Aishwarya Naik')).not.toBeInTheDocument();
            expect(screen.queryByText('Arvind Kumar')).not.toBeInTheDocument();
        })
    })

    it('should display the original data when the random characters are cleared', async () => {
        act(() => {
            render(<AdminTable />);
        });

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })

        const searchInput = screen.getByPlaceholderText('Search by name, email or role');

        fireEvent.change(searchInput, {
            target: {
                value: 'asdf',
            },
        })

        await waitFor(() => {
            expect(screen.queryByText('Aishwarya Naik')).not.toBeInTheDocument();
            expect(screen.queryByText('Arvind Kumar')).not.toBeInTheDocument();
        })

        fireEvent.change(searchInput, {
            target: {
                value: '',
            },
        })

        await waitFor(() => {
            expect(screen.getByText('Aishwarya Naik')).toBeInTheDocument();
            expect(screen.getByText('Arvind Kumar')).toBeInTheDocument();
        })
    })
});
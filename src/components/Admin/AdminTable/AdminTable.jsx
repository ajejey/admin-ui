import React, { useEffect, useState } from 'react'
import styles from './adminTable.module.css'
import { PAGE_LENGTH } from '../../../constants/constants'
import firstPage from '../../../assets/icons/paginationstartminor-svg.svg'
import prevPage from '../../../assets/icons/previous-svg.svg'
import nextPage from '../../../assets/icons/next-svg.svg'
import lastPage from '../../../assets/icons/paginationendminor-svg.svg'

function AdminTable() {
    let [searchText, setSearchText] = useState('')
    const [adminData, setAdminData] = useState([])
    const [noOfPages, setNoOfPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([])
    const [toEdit, setToEdit] = useState(null)
    const [allInPageSelected, setAllInPageSelected] = useState(false)

    const filterDataByText = (data) => {
        return data.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.email.toLowerCase().includes(searchText.toLowerCase()) ||
            item.role.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    const resetPages = (data) => {
        let filteredItems = filterDataByText(data)
        const noOfPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_LENGTH));
        const allPages = Array.from(
            { length: noOfPages },
            (_, index) => filteredItems.slice(index * PAGE_LENGTH, (index + 1) * PAGE_LENGTH)
        );
        setNoOfPages(noOfPages);
        setPages(allPages);
        if (currentPage > noOfPages) {
            setCurrentPage(noOfPages)
        }
    }

    const fetchAdminData = async () => {
        try {
            let response = await fetch(process.env.REACT_APP_BACKEND_URL)
            let data = await response.json()
            setAdminData(data)
            resetPages(data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleSearchChange = (event) => {
        searchText = event.target.value
        setSearchText(searchText)
        if (searchText === '') {
            resetPages(adminData)
        } else {
            let filteredItems = filterDataByText(adminData)
            console.log("filteredItems ", filteredItems)
            resetPages(filteredItems)
        }
    }

    const handleEditRowClick = (item) => {
        const { id } = item
        let rowToEdit = adminData.find((item) => item.id === id)
        console.log("rowToEdit ", rowToEdit)
        setToEdit(rowToEdit)
    }

    const handleDeleteRowClick = (item) => {
        const { id } = item
        let filteredItems = adminData.filter((item) => item.id !== id)
        setAdminData(filteredItems)
        resetPages(filteredItems)
    }

    const handleRowSelect = (event, row) => {
        console.log("selected row ", row)
        const selectedItem = adminData.map((item) => {
            if (item.id === row.id) {
                return { ...item, selected: event.target.checked }
            } else {
                return item
            }
        })
        setAdminData(selectedItem)
        resetPages(selectedItem)
        setAllInPageSelected(event.target.checked)
    }

    console.log("pages ", pages)
    console.log("adminData ", adminData)

    const handleEdit = (event, row) => {
        console.log("item ", row)
        const editedItem = adminData.map((item) => {
            if (item.id === row.id) {
                return { ...item, [event.target.name]: event.target.value }
            } else {
                return item
            }
        })
        setAdminData(editedItem)
        resetPages(editedItem)
    }

    const handleDeleteSelected = () => {
        let filteredItems = adminData.filter((item) => !item.selected)
        setAdminData(filteredItems)
        resetPages(filteredItems)
    }

    const handleSelectAllInPage = (event) => {
        const currentPageItems = pages[currentPage - 1];
        const updatedPages = [...pages];
        const updatedCurrentPageItems = currentPageItems.map((item) => ({
            ...item,
            selected: event.target.checked,
        }));
        updatedPages[currentPage - 1] = updatedCurrentPageItems;
        setPages(updatedPages);

        const flattenedUpdatedPages = updatedPages.flat();
        const updatedAdminData = adminData.map((item) => {
            const foundItem = flattenedUpdatedPages.find((updatedItem) => updatedItem.id === item.id);
            if (foundItem) {
                return foundItem;
            }
            return item;
        });
        setAdminData(updatedAdminData);
    }

    useEffect(() => {
        if (pages[currentPage - 1] && pages[currentPage - 1].length && pages[currentPage - 1].every(item => item.selected)) {
            setAllInPageSelected(true);
        } else {
            setAllInPageSelected(false);
        }
    }, [currentPage, pages]);


    useEffect(() => {
        fetchAdminData()
    }, [])

    return (
        <div>
            <div className={styles.search}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='Search by name, email or role'
                    className={styles.searchInput}
                    value={searchText}
                    onChange={handleSearchChange} />
            </div>
            <div className={styles.adminTableContainer}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" checked={allInPageSelected} onChange={handleSelectAllInPage} />
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.adminTableBody}>
                        {console.log("pages.length && pages[currentPage - 1] && pages[currentPage - 1] ", pages.length && pages[currentPage - 1] && pages[currentPage - 1])}
                        {pages.length && pages[currentPage - 1] && pages[currentPage - 1].map((item, index) => (
                            <tr key={index} style={{ backgroundColor: item.selected ? 'rgb(233, 233, 233)' : '' }}>
                                <td data-cell='select'>
                                    <input type="checkbox" checked={item.selected ? item.selected : false} name={item.id} onChange={(e) => handleRowSelect(e, item)} />
                                </td>
                                {toEdit && item.id === toEdit.id ? (
                                    <>
                                        <td data-cell='name'>
                                            <input
                                                type="text"
                                                value={item.name}
                                                name='name'
                                                data-testid={`editName-${item.id}`}
                                                onChange={(e) => handleEdit(e, item)}

                                            />
                                        </td>
                                        <td data-cell='email'>
                                            <input
                                                type="text"
                                                value={item.email}
                                                data-testid={`editEmail-${item.id}`}
                                                name='email'
                                                onChange={(e) => handleEdit(e, item)}
                                            />
                                        </td>
                                        <td data-cell='role'>
                                            <input
                                                type="text"
                                                value={item.role}
                                                name='role'
                                                data-testid={`editRole-${item.id}`}
                                                onChange={(e) => handleEdit(e, item)}

                                            />
                                        </td>
                                        <td data-cell='actions'>
                                            <button className={styles.actionButton} data-testid={`acceptButton-${item.id}`} title='Accept change' name="acceptButton" onClick={() => setToEdit(null)}> ✔️ </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td data-cell='name'>{item.name}</td>
                                        <td data-cell='email'>{item.email}</td>
                                        <td data-cell='role'>{item.role}</td>
                                        <td data-cell='actions'>
                                            <div>
                                                <button className={styles.actionButton} data-testid={`editButton-${item.id}`} title='Edit row' name="editButton" onClick={() => handleEditRowClick(item)}> ✏️ </button>
                                                <button className={styles.actionButton} data-testid={`deleteButton-${item.id}`} title='Delete row' name="deleteButton" onClick={() => handleDeleteRowClick(item)}> ❌ </button>
                                            </div>
                                        </td>
                                    </>
                                )}

                            </tr>
                        ))}
                        {pages.flat().length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.noDataRow}>No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.AdminPagination}>
                <div>
                    <button className={styles.deleteSelectedButton} disabled={(pages[currentPage - 1] ?? []).every(item => !item.selected)} onClick={handleDeleteSelected}>Delete Selected</button>
                </div>
                <div className={styles.adminPaginationButtons}>
                    <button className={styles.actionButton} data-testid="firstPage" onClick={() => setCurrentPage(1)}><img src={firstPage} width="16px" height="16px" alt="first page" /></button>
                    <button className={styles.actionButton} data-testid="previousPage" onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}><img src={prevPage} width="16px" height="16px" alt="previous page" /></button>
                    {Array.from({ length: noOfPages }, (_, index) => index + 1).map((page) => (
                        <button

                            onClick={() => setCurrentPage(page)}
                            className={styles.paginationButton}
                            style={{ backgroundColor: currentPage === page ? '#01aef3' : '' }}
                            key={page}
                        >
                            {page}
                        </button>
                    ))}
                    <button className={styles.actionButton} data-testid="nextPage" onClick={() => setCurrentPage(currentPage === noOfPages ? noOfPages : currentPage + 1)}><img src={nextPage} width="16px" height="16px" alt="next page" /></button>
                    <button className={styles.actionButton} data-testid="lastPage" onClick={() => setCurrentPage(noOfPages)}><img src={lastPage} width="16px" height="16px" alt="last page" /></button>
                </div>
                <div>
                    <button style={{ opacity: 0 }} className={styles.deletedSelectedButton}>Delete Selected</button>
                </div>

            </div>
        </div>
    )
}

export default AdminTable
export const mobileSelectStyles = {
    control: (prev, state) => ({
        ...prev,
        height: '4vh',
        width: '100%',
        borderRadius: '0',
        margin: '0',
        padding: '0',
        fontSize: '1.5vh',
        outline: '2px solid black',
        border: 'none',
        boxShadow: state.isFocused ? null : null,
    }),
    valueContainer: (prev) => ({
        ...prev,
        paddingLeft: '1vw',
        height: '100%',
        margin: '0',
        padding: '0',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    placeholder: (prev) => ({
        ...prev,
        color: 'rgba(71, 65, 65, 1)'
    }),
    option: (prev, state) => ({
        ...prev,
        backgroundColor: state.isSelected ? '#0066FF' : 'transparent',
        fontSize: 'small'
    })
}
export const SelectStyles = {
    control: (prev, state) => ({
        ...prev,
        height: '5vh',
        width: '15vw',
        borderRadius: '0',
        margin: '0',
        padding: '0',
        fontSize: '2vh',
        outline: '2px solid black',
        border: 'none',
        boxShadow: state.isFocused ? null : null,
    }),
    valueContainer: (prev) => ({
        ...prev,
        paddingLeft: '1vw',
        height: '100%',
        margin: '0',
        padding: '0',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    placeholder: (prev) => ({
        ...prev,
        color: 'rgba(71, 65, 65, 1)'
    }),
    option: (prev, state) => ({
        ...prev,
        backgroundColor: state.isSelected ? '#0066FF' : 'transparent',
        fontSize: 'small'
    })
}

export const options = [
    { value: 'Food', label: 'Food' },
    { value: 'Health and Fitness', label: 'Health and Fitness' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Movie', label: 'Movie' },
    { value: 'Education', label: 'Education' },
]

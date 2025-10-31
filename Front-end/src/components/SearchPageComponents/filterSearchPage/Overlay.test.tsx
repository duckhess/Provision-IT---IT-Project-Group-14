import { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
import Overlay from './Overlay'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Overlay Component Integration', () => {
  const onClose = vi.fn()
  const onApplyFilters = vi.fn()
  const setFilters = vi.fn()

  type AmountRange = "low" | "medium" | "high" | "";

  const filters = {
    amountRange: "" as AmountRange,
    industry: '',
    location: '',
  }

  const industryOptions = ['Tech', 'Finance']
  const locationOptions = ['Sydney', 'Melbourne']

  // Helper function to select a dropdown option ---
async function selectDropdownOption(dropdownTestId: string, optionTestId: string) {
  const user = userEvent.setup()

  // Click the dropdown trigger
  const dropdownTrigger = within(screen.getByTestId(dropdownTestId)).getByTestId('dropdownTrigger')
  await user.click(dropdownTrigger)

  const option = await waitFor(() => screen.getByTestId(optionTestId))

  await user.click(option)
}

function unwrapSetFiltersCall(call: unknown) {
  if (typeof call === 'function') return call({})
  return call
}

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all dropdowns and the filter button', () => {
    render(
      <Overlay
        onClose={onClose}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={onApplyFilters}
        industryOptions={industryOptions}
        locationOptions={locationOptions}
      />
    )
    expect(screen.getByTestId('filterFundNeeded')).toBeInTheDocument()
    expect(screen.getByTestId('filterIndustry')).toBeInTheDocument()
    expect(screen.getByTestId('filterLocation')).toBeInTheDocument()
    
    const filterButton = screen.getByRole('button', {name : /filter/i})
    expect(filterButton).toBeInTheDocument()

  })

  it('closes overlay when close button is clicked', () => {
    render(
      <Overlay
        onClose={onClose}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={onApplyFilters}
        industryOptions={industryOptions}
        locationOptions={locationOptions}
      />
    )

    const closeButton = screen.getByTestId("closeButton")
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

 it('calls setFilters when selecting dropdown options', async () => {
  render(
    <Overlay
      onClose={onClose}
      filters={filters}
      setFilters={setFilters}
      onApplyFilters={onApplyFilters}
      industryOptions={industryOptions}
      locationOptions={locationOptions}
    />
  )

  //  Fund Needed
  await selectDropdownOption('filterFundNeeded', 'option-Below $1,500,000')
  const firstCallArg = unwrapSetFiltersCall(setFilters.mock.calls[0][0])
  expect(firstCallArg).toEqual(expect.objectContaining({ amountRange: 'low' }))

  // Industry
  await selectDropdownOption('filterIndustry', 'option-Tech')
  const secondCallArg = unwrapSetFiltersCall(setFilters.mock.calls[1][0])
  expect(secondCallArg).toEqual(expect.objectContaining({ industry: 'Tech' }))

  // Location
  await selectDropdownOption('filterLocation', 'option-Sydney')
  const thirdCallArg = unwrapSetFiltersCall(setFilters.mock.calls[2][0])
  expect(thirdCallArg).toEqual(expect.objectContaining({ location: 'Sydney' }))
})

  it('calls onApplyFilters when Filter button is clicked', () => {
    render(
      <Overlay
        onClose={onClose}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={onApplyFilters}
        industryOptions={industryOptions}
        locationOptions={locationOptions}
      />
    )

    const filterButton = screen.getByRole('button', {name : /filter/i})
    expect(filterButton).toBeInTheDocument()

    fireEvent.click(filterButton)

    expect(onApplyFilters).toHaveBeenCalledTimes(1)
  })
})

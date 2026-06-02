require 'rails_helper'

RSpec.describe Expense, type: :model do
  describe 'validations' do
    let(:category) { Category.create!(name: 'Test') }

    it 'is valid with a past date' do
      expense = Expense.new(description: 'test', amount: 10, category: category, date: Date.yesterday)
      expect(expense).to be_valid
    end

    it 'is valid with today date' do
      expense = Expense.new(description: 'test', amount: 10, category: category, date: Date.current)
      expect(expense).to be_valid
    end

    it 'is invalid with a future date' do
      expense = Expense.new(description: 'test', amount: 10, category: category, date: Date.tomorrow)
      expect(expense).not_to be_valid
      expect(expense.errors[:date]).to include("cannot be in the future")
    end
  end
end

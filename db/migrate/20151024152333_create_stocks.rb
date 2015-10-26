class CreateStocks < ActiveRecord::Migration
  def change
    create_table :stocks do |t|
      t.string :ticker_symbol
      t.integer :shares
      t.string :note

      t.timestamps null: false
    end
  end
end

class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.string :ticker_symbol
      t.references :user, index: true, foreign_key: true
      t.datetime :timestamp
      t.decimal :price
      t.integer :shares

      t.timestamps null: false
    end
  end
end

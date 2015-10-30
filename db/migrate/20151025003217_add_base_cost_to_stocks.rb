class AddBaseCostToStocks < ActiveRecord::Migration
  def change
    add_column :stocks, :base_cost, :decimal
  end
end

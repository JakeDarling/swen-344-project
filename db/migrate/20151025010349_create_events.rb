class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.datetime :start
      t.datetime :end
      t.string :description
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end

  def up
  	rename_column :events, :end, :end1
  end
end

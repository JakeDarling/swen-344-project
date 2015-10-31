class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.datetime :start
      t.datetime :end1
      t.string :description
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

require 'elasticsearch'

class PageViewsController < ApplicationController
  before_action :set_page_view, only: [:show, :update, :destroy]

  # GET /page_views
  def index
    client = Elasticsearch::Client.new url: 'http://elastic:streem@test.es.streem.com.au:9200'

    response = client.search index: 'events', 
        body: { 
            aggregations: {
                time_ranges: {
                    range: {
                        field: "derived_tstamp",
                        ranges: [
                            { from: "2017-06-01T15:00:00.000Z", to: "2017-06-01T15:30:00.000Z"},
                            { from: "2017-06-01T15:31:00.000Z", to: "2017-06-01T16:00:00.000Z"}
                        ]
                    },
                    aggregations: {
                        url_bucket: {
                            terms: {
                                field: "page_url",
                                size: 5
                            }
                        }
                    }
                }
            }
        }

    @page_views = response

    render json: @page_views
  end

  # GET /page_views/1
  def show
    render json: @page_view
  end

  # POST /page_views
  def create
    @page_view = PageView.new(page_view_params)

    if @page_view.save
      render json: @page_view, status: :created, location: @page_view
    else
      render json: @page_view.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /page_views/1
  def update
    if @page_view.update(page_view_params)
      render json: @page_view
    else
      render json: @page_view.errors, status: :unprocessable_entity
    end
  end

  # DELETE /page_views/1
  def destroy
    @page_view.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_page_view
      @page_view = PageView.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def page_view_params
      params.require(:page_view).permit(:url, :views)
    end
end

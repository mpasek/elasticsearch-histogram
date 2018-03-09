require 'elasticsearch'

class PageViewsController < ApplicationController
  before_action :set_page_view, only: [:show, :update, :destroy]

  # POST /page_views
  def create
    @request_data = params[:page_view]
    @urls = params[:page_view][:urls]
    @start_time = params[:page_view][:startTime]
    @end_time = params[:page_view][:endTime]
    @interval = params[:page_view][:interval]

    puts @request_data
    puts @urls
    puts @start_time
    puts @end_time
    puts @interval

    client = Elasticsearch::Client.new url: 'http://elastic:streem@test.es.streem.com.au:9200'

    response = client.search index: 'events',
        body: {
            query: {
              bool: {
                must:{
                  range: {
                    derived_tstamp: {
                      from: @start_time,
                      to: @end_time
                    }
                  }
                },
                filter: {
                  terms:  { 
                    page_url: @urls, 
                  }
                }
              }
            },
            
            aggregations: {
              time_bucket: {
                date_histogram: {
                  field: "derived_tstamp",
                  interval: @interval,
                  min_doc_count: 0,
                  extended_bounds: {
                    min: @start_time,
                    max: @end_time
                  }
                },
                aggregations: {
                  url_bucket: {
                    terms: {
                      field: "page_url"
                    }
                  }
                }
              }
              
            }
          
          
        }

    render json: response    
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

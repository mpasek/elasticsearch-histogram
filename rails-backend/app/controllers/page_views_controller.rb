require 'elasticsearch'

class PageViewsController < ApplicationController
  before_action :set_page_view, only: [:show, :update, :destroy]

  # GET /page_views
  def index
    client = Elasticsearch::Client.new url: 'http://elastic:streem@test.es.streem.com.au:9200'

    response = client.search index: 'events',
        body: {
            query: {
              bool: {
                must:{
                  range: {
                    derived_tstamp: {
                      from: 1496293200000,
                      to: 1496300400000
                    }
                  }
                }
              }
            },
            
            aggregations: {
              time_bucket: {
                date_histogram: {
                  field: "derived_tstamp",
                  interval: "10m"
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


  # POST /page_views
  def create
    @request_data = params[:page_view]

    info = request.raw_post
    parsed_data = JSON.parse(info)
    puts parsed_data

    urls = parsed_data["urls"]
    start_time = parsed_data["startTime"]
    @end_time = params[:page_view]["endTime"]
    @interval = params[:page_view]["interval"]

    puts urls
    puts start_time
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
                      from: 1496293200000,
                      to: 1496300400000
                    }
                  }
                }
              }
            },
            
            aggregations: {
              time_bucket: {
                date_histogram: {
                  field: "derived_tstamp",
                  interval: "10m"
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

    @response = response

    render json: @response

    
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

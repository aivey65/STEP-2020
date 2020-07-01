// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet stores and retrieves data about favorite milk tea flavors. */
@WebServlet("/tea-vote")
public class TeaVoteServlet extends HttpServlet {
    private final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String flavor = request.getParameter("flavor");
        String topping = request.getParameter("topping");

        Entity voteEntity = new Entity("TeaVote");
        voteEntity.setProperty("flavor", flavor);
        voteEntity.setProperty("topping", topping);

        datastore.put(voteEntity);
        response.sendRedirect("/index.html");
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Query query = new Query("TeaVote");
        Iterable<Entity> results = datastore.prepare(query).asIterable();
        
        HashMap<String, Integer> flavorVotes = new HashMap<String, Integer>();
        HashMap<String, Integer> toppingVotes = new HashMap<String, Integer>();

        for (Entity entity : results) {
            String flavor = (String) entity.getProperty("flavor");
            String topping = (String) entity.getProperty("topping");

            flavorVotes.put(flavor, flavorVotes.getOrDefault(flavor, 0) + 1);
            toppingVotes.put(topping, toppingVotes.getOrDefault(topping, 0) + 1);
        }
        
        Gson gson = new Gson();
        String flavorVotesJsonString = gson.toJson(flavorVotes);
        String toppingVotesJsonString = gson.toJson(toppingVotes);

        String dataResponse = "{\"flavorVotes\":" + flavorVotesJsonString 
                            + ",\"toppingVotes\":" + toppingVotesJsonString
                            + "}";

        response.setContentType("application/json");
        response.getWriter().println(dataResponse);
    }
}

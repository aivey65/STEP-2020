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
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
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
        //Update or add flavor entity.
        String flavor = request.getParameter("flavor");
        Query flavorQuery = new Query("FlavorVote").setFilter(
            new Query.FilterPredicate("flavor", Query.FilterOperator.EQUAL, flavor));
        Entity flavorVoteEntity = datastore.prepare(flavorQuery).asSingleEntity();
        long totalFlavorVotes = 0;

        if (flavorVoteEntity != null) {
            totalFlavorVotes = (long) flavorVoteEntity.getProperty("votes");
        } else {
            //Flavor entity does not exist. Create a new one.
            flavorVoteEntity = new Entity("FlavorVote");
        }

        flavorVoteEntity.setProperty("flavor", flavor);
        flavorVoteEntity.setProperty("votes", totalFlavorVotes + 1);

        //Update or add topping entity.
        String topping = request.getParameter("topping");
        Query toppingQuery = new Query("ToppingVote").setFilter(
            new Query.FilterPredicate("topping", Query.FilterOperator.EQUAL, topping));
        Entity toppingVoteEntity = datastore.prepare(toppingQuery).asSingleEntity();
        long totalToppingVotes = 0;

         if (toppingVoteEntity != null) {
            totalToppingVotes = (long) toppingVoteEntity.getProperty("votes");
        } else {
            //Topping entity does not exist. Create a new one.
            toppingVoteEntity = new Entity("ToppingVote");
        }

        toppingVoteEntity.setProperty("topping", topping);
        toppingVoteEntity.setProperty("votes", totalToppingVotes + 1);

        datastore.put(flavorVoteEntity);
        datastore.put(toppingVoteEntity);
        response.sendRedirect("/index.html");
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Creating hashmap of flavors and votes.
        Iterable<Entity> flavorResults = datastore.prepare(new Query("FlavorVote")).asIterable();
        HashMap<String, Long> flavorVotes = new HashMap<String, Long>();

        for (Entity entity : flavorResults) {
            String flavor = (String) entity.getProperty("flavor");
            long votes = (long) entity.getProperty("votes");

            flavorVotes.put(flavor, votes);
        }

        //Creating hashmap of toppings and votes.
        Iterable<Entity> toppingResults = datastore.prepare(new Query("ToppingVote")).asIterable();
        HashMap<String, Long> toppingVotes = new HashMap<String, Long>();

        for (Entity entity : toppingResults) {
            String topping = (String) entity.getProperty("topping");
            long votes = (long) entity.getProperty("votes");

            toppingVotes.put(topping, votes);
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
